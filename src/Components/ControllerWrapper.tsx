import { Controller } from "react-hook-form";

export default function ControllerWrapper({ name, control, children }: any) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
                children
            )}
        />
    )
}