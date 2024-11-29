import { useFormStatus } from "react-dom";

export default function Pending() {
    const { pending } = useFormStatus();
    return (
        <div>
            {pending ? "pending" : "not pending"}
        </div>
    )
}