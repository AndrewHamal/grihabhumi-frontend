import { Checkbox, MenuItem } from "@chakra-ui/react";
import { useFieldArray } from "react-hook-form";

export default function MultiMenuSelect({ arrayData = [], control, name, onChange = () => { } }: any) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: name
    })

    return (
        arrayData?.map((res: any, key: number) => (
            <MenuItem key={key}>
                <Checkbox colorScheme='green'
                    onChange={() => {
                        let exists = fields?.find((resp: any) => resp?._id?.toString() == res?.id?.toString());

                        if (exists) {
                            let index = fields.findIndex((resp: any) => resp._id?.toString() == res?.id?.toString())
                            remove(index)
                        } else {
                            append({ _id: res?.id?.toString() })
                        }

                        onChange()
                    }}
                    isChecked={fields?.map((res: any) => res._id?.toString()).includes(res?.id?.toString())}
                    fontSize="12px !important">
                    {res.name}
                </Checkbox>
            </MenuItem>
        ))
    )
}