import {FC, useEffect, useMemo } from 'react';
import styles from "./MarkdownRenderer.module.scss";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { CodeBlock } from '..';

interface ComponentProps {
    children: string;
}

export const MarkdownRenderer: FC<ComponentProps> = ({
    children
}) => {
    return (
        <div className={styles["markdown"]}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    h1: ({ children }) => <h1 className={styles["h1"]}>{children}</h1>,
                    h2: ({ children }) => <h2 className={styles["h2"]}>{children}</h2>,
                    h3: ({ children }) => <h3 className={styles["h3"]}>{children}</h3>,

                    p: ({ children }) => <p className={styles["p"]}>{children}</p>,

                    strong: ({ children }) => (
                        <strong className={styles["strong"]}>{children}</strong>
                    ),

                    em: ({ children }) => (
                        <em className={styles["em"]}>{children}</em>
                    ),

                    del: ({ children }) => (
                        <del className={styles["del"]}>{children}</del>
                    ),

                    ul: ({ children }) => <ul className={styles["ul"]}>{children}</ul>,
                    ol: ({ children }) => <ol className={styles["ol"]}>{children}</ol>,
                    li: ({ children }) => <li className={styles["li"]}>{children}</li>,

                    blockquote: ({ children }) => (
                        <blockquote className={styles["blockquote"]}>
                            {children}
                        </blockquote>
                    ),

                    a: ({ href, children }) => (
                        <a
                            href={href}
                            className={styles["link"]}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {children}
                        </a>
                    ),

                    hr: () => <hr className={styles["hr"]} />,

                    table: ({ children }) => (
                        <div className={styles["table-wrapper"]}>
                            <table className={styles["table"]}>{children}</table>
                        </div>
                    ),

                    th: ({ children }) => <th className={styles["th"]}>{children}</th>,
                    td: ({ children }) => <td className={styles["td"]}>{children}</td>,

                    code: ({ children, className, ...props }: any) => {
                        const isBlock = className && /language-/.test(className);
                        if (!isBlock) {
                            return (
                                <code className={`${styles["inline-code"]} ${className || ''}`} {...props}>
                                    {children}
                                </code>
                            );
                        }

                        return (
                            <code className={`${className || ''}`} {...props}>
                                {children}
                            </code>
                        );
                    },

                    pre: ({ children, className, ...props }: any) => (
                        <CodeBlock className={className} {...props}>
                            {children}
                        </CodeBlock>
                    ),
                }}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
};