import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./Authorization.module.scss";
import { motion } from "motion/react";
import { ArrowRight, Logotype, Sparkles } from "../../components/SVG";
import { BackgroundBlob, BackgroundMesh, Button, Spinner } from "../../components/UI";
import { useActions, useAppSelector } from "../../hooks/redux";
import { allActions } from "../../store/reducers/actions";
import { Confirm, LogIn, Recovery, RecoveryPassword, SingUp } from "../../components/Authorization";
import { useGetMeQuery, useSendEmailMutation } from "../../services/accountService";
import { Navigate, useNavigate } from "react-router-dom";

export const Authorization: FC = () => {
    const {page, email} = useAppSelector(state => state.authorizationReducer);
    const {setPage, setEmail} = useActions(allActions.authorization);
    
    const ref = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | "auto">("auto");

    const navigate = useNavigate();

    const [sendEmail] = useSendEmailMutation();
    const { isLoading, data: user } = useGetMeQuery(); 

    const handleReceiveEmail = async () => await sendEmail({ 
        type: "authorization.receive",
        email: email
    }).unwrap();

    useEffect(() => {
        setEmail("");
        setPage("login");
    }, [ ])

    useLayoutEffect(() => {
        if (!ref.current) return;
        const el = ref.current;
        setHeight(el.scrollHeight);
    }, [page]);

    if (isLoading) {
        return (
            <div className={styles["spinner-container"]}>
                <Spinner className={styles["spinner"]} />
            </div>
        );
    }

    if (user) return <Navigate to={"/dashboard"} replace />;

    useEffect(() => {
        setEmail("");
        setPage("login");
    }, [ ])

    useLayoutEffect(() => {
        if (!ref.current) return;
        const el = ref.current;
        setHeight(el.scrollHeight);
    }, [page]);


    return (
        <div className={styles["authorization"]}>
            <div className={styles["blobs"]}>
                <BackgroundBlob className={`${styles["blob"]} ${styles["top-left"]}`} color="orange" animation="pulse-2" />
                <BackgroundBlob className={`${styles["blob"]} ${styles["top-right"]}`} color="pink" animation="pulse-2" delay={2000} />
                <BackgroundBlob className={`${styles["blob"]} ${styles["bottom-left"]}`} color="purple" animation="pulse-2" delay={4000} />
                <BackgroundBlob className={`${styles["blob"]} ${styles["bottom-right"]}`} color="blue" animation="pulse-2" delay={4000} />
            </div>
            <BackgroundMesh />

            {[...Array(4)].map((_, index) => (
                <motion.div
                    key={index}
                    className={styles["floating-icons"]}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        x: index % 2 === 0 ? [0, 20, 0] : [0, -20, 0],
                        y: [0, Math.random() * 400 - 100, 0],
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        delay: index * 0.5,
                        duration: Math.random() * (4.5 - 3) + 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        left: `${20 + index * 20}%`,
                        top: `${15 + index * 15}%`,
                    }}
                >
                    <Sparkles className={styles["icon"]} />
                </motion.div>
            ))}

            <div className={styles["content"]}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className={styles["branding"]}
                >
                    <Button className={styles["back-button"]} variant="secondary" onClick={() => navigate("/")}>
                        <ArrowRight className={styles["icon"]} />
                        <span>Назад на главную</span> 
                    </Button>
                    <div className={styles["logotype"]}>
                        <div className={styles["icon-container"]}>
                            <Logotype className={styles["icon"]} />
                        </div>
                        <span className={styles["name"]}>Adzen</span>
                    </div>
                    <div className={styles["title"]}>
                        <span>Добро</span>
                        <span>пожаловать в</span>
                        <span className={styles["gradient"]}>будущее рекламы</span>
                    </div>
                    <span className={styles["description"]}>
                        {page.startsWith("recovery") || page === "confirm" ?
                            "Восстановите доступ к своему аккаунту, следуя простым шагам."
                            :
                            "Войдите в свой аккаунт и начните создавать эффективные рекламные кампании с помощью искусственного интеллекта."
                        }
                    </span>
                </motion.div>

                <div
                    className={styles["form-container"]}
                    style={{height}}
                >
                    <div ref={ref} className={styles["form"]}>
                        {(!page.startsWith("recovery") && page !== "confirm") &&                    
                            <div className={styles["toggle-container"]}>
                                <Button
                                    variant="secondary"
                                    className={`${styles["button"]} ${page == "login" ? styles["active"] : ""}`}
                                    onClick={() => setPage("login")}
                                >
                                    Вход
                                </Button>
                                <Button
                                    variant="secondary"
                                    className={`${styles["button"]} ${page == "signup" ? styles["active"] : ""}`}
                                    onClick={() => setPage("signup")}
                                >
                                    Регистрация
                                </Button>
                            </div>
                        }
                        {page === "login" && <LogIn />}

                        {page === "confirm" &&
                            <Confirm
                                type="google"
                                title="Введите код из приложения Google Authenticator." 
                            />
                        }
                        {page === "recovery" && <Recovery />}
                        {page === "recoveryCode" &&
                            <Confirm
                                type="email"
                                receiveService={handleReceiveEmail} 
                                title="Код подтверждения был отправлен на почту:" 
                                value={email?.replace(/(?<=.{2}).(?=.*.{2}@)/g, '*')}
                            />
                        }
                        {page === "recoveryPassword" && <RecoveryPassword />}
                        {page === "signup" && <SingUp />}
                        <div className={styles["footer"]}>
                            {page.startsWith("recovery") || page === "confirm" ?
                                <Button 
                                    variant="secondary"
                                    className={`${styles["button"]} ${styles["back"]}`}
                                    onClick={() => setPage("login")}
                                >
                                    <ArrowRight className={styles["icon"]} />
                                    <span>Вернуться к входу</span>
                                </Button>
                                :
                                <>                            
                                    <span>{page === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}</span>
                                    <Button 
                                        variant="secondary"
                                        className={styles["button"]}
                                        onClick={() => setPage( page === "login" ? "signup" : "login")}
                                    >
                                        {page === "login" ? "Зарегистрируйтесь" : "Войдите"}
                                    </Button>
                                </>     
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};