import React, { FC, HTMLProps, useEffect, useRef, useState } from "react";
import styles from "./CodeBlock.module.scss";
import { Check, Copy } from "../../SVG";

interface ComponentProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement> {
    className: HTMLProps<HTMLElement>["className"];
    children: React.ReactNode;
}

export const CodeBlock: FC<ComponentProps> = ({
    className,
    children,
    ...props
}) => {
    const [codeText, setCodeText] = useState('');
    const [language, setLanguage] = useState('');
    const [copied, setCopied] = useState(false);

    const preRef = useRef<HTMLPreElement>(null);

    const handleCopy = () => {
        if (!codeText) return;
        navigator.clipboard.writeText(codeText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    useEffect(() => {
        if (preRef.current) {
            const codeElement = preRef.current.querySelector('code');

            if (codeElement) {
                setCodeText(codeElement.textContent || '');
                
                const classList = Array.from(codeElement.classList);
                const langClass = classList.find(cls => cls.startsWith('language-'));
                
                if (langClass) {
                    const lang = langClass.replace('language-', '');
                    setLanguage(lang);
                } else setLanguage('text');
            }
        }
    }, [children]);

    return (
        <div className={styles["code-wrapper"]}>
            <div className={styles["code-header"]}>
                <span className={styles["code-lang"]}>{language}</span>
                <div 
                    className={styles["copy-button"]} 
                    onClick={handleCopy}
                >
                    {copied ?
                        <Check className={styles["icon"]} />
                        : 
                        <Copy className={styles["icon"]} />
                    }
                </div>
            </div>
            <pre 
                ref={preRef}
                className={`${styles["code-block"]} ${className || ''}`} 
                {...props}
            >
                {children}
            </pre>
        </div>
    )
};