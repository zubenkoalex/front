import {FC, HTMLProps} from 'react'
import styles from './Header.module.scss'
import { Logotype } from '../../SVG';
import { Button } from '../../UI';
import { useNavigate } from 'react-router-dom';

export interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
}

export const Header: FC<ComponentProps> = ({
    className
}) => {

    const navigate = useNavigate();

    return (
        <div className={`${styles["header"]} ${className ? className : ""}`}>
            <div className={styles["container"]}>
                <div className={styles["inner"]}>
                    <div className={styles["logotype"]}>
                        <div className={styles["icon-container"]}>
                            <Logotype className={styles["icon"]} />
                        </div>
                        <span className={styles["name"]}>Adzen</span>
                    </div>  

                    <Button className={styles["button"]} variant="secondary" onClick={() => navigate("/login")}>
                        <span>Войти</span>
                    </Button>
                </div>
            </div>
        </div>
    )
};