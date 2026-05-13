import { FC } from "react";

export const Warning: FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg {...props} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.833374 17.5001H19.1667L10 1.66675L0.833374 17.5001ZM10.8334 15.0001H9.16671V13.3334H10.8334V15.0001ZM10.8334 11.6667H9.16671V8.33341H10.8334V11.6667Z"/>
        </svg>
    );
};