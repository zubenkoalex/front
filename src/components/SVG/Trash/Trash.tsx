import { FC } from "react";

export const Trash: FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg {...props} viewBox="0 0 31 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M31 2.22222H23.25L21.0357 0H9.96429L7.75 2.22222H0V6.66667H31M2.21429 35.5556C2.21429 36.7343 2.68087 37.8648 3.51138 38.6982C4.3419 39.5317 5.46833 40 6.64286 40H24.3571C25.5317 40 26.6581 39.5317 27.4886 38.6982C28.3191 37.8648 28.7857 36.7343 28.7857 35.5556V8.88889H2.21429V35.5556Z" />
        </svg>
    );
};