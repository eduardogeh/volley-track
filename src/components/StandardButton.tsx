import 'react';
import { Button as MuiButton, type ButtonProps as MuiButtonProps, styled, type Theme } from '@mui/material';

type ButtonVariant = 'primary' | 'secondary' | 'delete'; // Removido 'outlined' pois será o padrão

interface StandardButtonProps extends Omit<MuiButtonProps, 'variant' | 'color'> {
    buttonType: ButtonVariant;
}

const CustomButton = styled(MuiButton)<{ theme?: Theme; color?: MuiButtonProps['color'] }>(({ theme, color = 'primary' }) => ({
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: 'bold',
    textTransform: 'none',
    borderRadius: '8px',
    transition: 'all 0.2s ease-in-out',
    variant: 'outlined',

    '&:hover': {
        //@ts-expect-error acessing theme colors
        backgroundColor: theme.palette[color].main,
        //@ts-expect-error accessing theme colors
        color: theme.palette[color].contrastText,
        transform: 'scale(1.02)',
    },
}));

export function StandardButton({ buttonType, children, ...rest }: StandardButtonProps) {
    const getColor = (): MuiButtonProps['color'] => {
        switch (buttonType) {
            case 'primary':
                return 'primary';
            case 'secondary':
                return 'secondary';
            case 'delete':
                return 'error';
            default:
                return 'primary';
        }
    };

    return (
        <CustomButton color={getColor()} {...rest}>
            {children}
        </CustomButton>
    );
}