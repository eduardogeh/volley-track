const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

let FFMPEG_BIN;
try {
    const ffmpegPath = require("ffmpeg-static");
    FFMPEG_BIN = ffmpegPath || "ffmpeg";
    console.log("[FFMPEG] usando ffmpeg-static em:", FFMPEG_BIN);
} catch (e) {
    FFMPEG_BIN = "ffmpeg";
    console.log("[FFMPEG] ffmpeg-static não encontrado, usando 'ffmpeg' do sistema");
}

let HAS_DRAWTEXT = null;

function runFfmpeg(args, options = {}) {
    return new Promise((resolve, reject) => {
        console.log("[ffmpeg] args:", args.join(" "));
        const ff = spawn(FFMPEG_BIN, args, {
            stdio: options.stdio || "inherit",
        });

        ff.on("error", (err) => {
            reject(err);
        });

        ff.on("close", (code) => {
            if (code === 0) resolve();
            else reject(new Error(`ffmpeg exited with code ${code}`));
        });
    });
}

async function detectHasDrawtext() {
    if (HAS_DRAWTEXT !== null) {
        return HAS_DRAWTEXT;
    }

    return new Promise((resolve) => {
        console.log("[FFMPEG] verificando suporte a drawtext...");
        const ff = spawn(FFMPEG_BIN, ["-filters"], {
            stdio: ["ignore", "pipe", "ignore"],
        });

        let out = "";

        ff.stdout.on("data", (chunk) => {
            out += chunk.toString();
        });

        ff.on("error", (err) => {
            console.error("[FFMPEG] erro ao checar filtros:", err);
            HAS_DRAWTEXT = false;
            resolve(false);
        });

        ff.on("close", (code) => {
            if (code === 0 && out.includes(" drawtext ")) {
                HAS_DRAWTEXT = true;
            } else {
                HAS_DRAWTEXT = false;
            }
            console.log("[FFMPEG] drawtext disponível?", HAS_DRAWTEXT);
            resolve(HAS_DRAWTEXT);
        });
    });
}

function escapeDrawtext(text) {
    return text
        .replace(/\\/g, "\\\\")
        .replace(/:/g, "\\:")
        .replace(/'/g, "\\'");
}

/**
 * @param {string} videoPath
 * @param {{ start: number, end: number, description: string }[]} clips
 * @param {string} outputPath
 */
async function exportPlaylist(videoPath, clips, outputPath) {
    if (!fs.existsSync(videoPath)) {
        throw new Error(`Arquivo de vídeo não encontrado: ${videoPath}`);
    }

    if (!clips || clips.length === 0) {
        throw new Error("Nenhum clipe informado.");
    }

    const tmpDir = fs.mkdtempSync(
        path.join(os.tmpdir(), "scout-playlist-")
    );

    const segmentPaths = [];

    try {
        const canUseDrawtext = await detectHasDrawtext();

        if (!canUseDrawtext) {
            console.warn(
                "[FFMPEG] drawtext NÃO disponível neste ffmpeg. " +
                "Os clipes serão gerados sem legenda."
            );
        }

        for (let i = 0; i < clips.length; i++) {
            const clip = clips[i];
            const duration = clip.end - clip.start;
            if (duration <= 0) {
                console.warn("[exportPlaylist] Ignorando clip com duração <= 0:", clip);
                continue;
            }

            const segFilename = `segment_${String(i + 1).padStart(3, "0")}.mp4`;
            const segPath = path.join(tmpDir, segFilename);
            segmentPaths.push(segPath);

            const args = [
                "-y",
                "-ss",
                clip.start.toString(),
                "-t",
                duration.toString(),
                "-i",
                videoPath,
            ];

            if (canUseDrawtext && clip.description) {
                const text = escapeDrawtext(clip.description || "");
                const drawtextFilter =
                    `drawtext=text='${text}':` +
                    "fontcolor=white:fontsize=32:" +
                    "box=1:boxcolor=black@0.5:boxborderw=10:" +
                    "x=(w-text_w)/2:y=h-80";

                args.push("-vf", drawtextFilter);
            }

            args.push(
                "-c:v",
                "libx264",
                "-preset",
                "veryfast",
                "-crf",
                "20",
                "-c:a",
                "aac",
                "-movflags",
                "+faststart",
                segPath
            );

            await runFfmpeg(args);
        }

        if (segmentPaths.length === 0) {
            throw new Error("Nenhum segmento válido gerado.");
        }

        const concatListPath = path.join(tmpDir, "concat_list.txt");
        const concatContent = segmentPaths
            .map((p) => `file '${p.replace(/'/g, "'\\''")}'`)
            .join("\n");
        fs.writeFileSync(concatListPath, concatContent, "utf-8");

        // 3) concat final
        const concatArgs = [
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            concatListPath,
            "-c",
            "copy",
            outputPath,
        ];

        await runFfmpeg(concatArgs);
    } finally {
        try {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        } catch (e) {
            console.error("Erro limpando temp dir:", e);
        }
    }
}

module.exports = {
    exportPlaylist,
};
