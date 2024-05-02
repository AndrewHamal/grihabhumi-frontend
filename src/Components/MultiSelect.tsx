import { Tab, TabList, Tabs } from "@chakra-ui/react";
import { useFieldArray } from "react-hook-form";

export default function MultiSelect({ arrayData = [], control, name, onChange = () => { } }: any) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: name
    })

    return (
        <Tabs isFitted variant='unstyled' position={"relative"} size={"sm"} >
            <TabList className="flex-wrap items-center gap-3">
                {arrayData?.map((res: any, key: number) => (
                    <Tab key={key}
                        onClick={() => {
                            let exists = fields?.find((resp: any) => resp?._id?.toString() == res?.id?.toString());

                            if (exists) {
                                let index = fields.findIndex((resp: any) => resp._id?.toString() == res?.id?.toString())
                                remove(index)
                            } else {
                                append({ _id: res?.id?.toString() })
                            }

                            onChange()
                        }}
                        rounded={5}
                        className={fields?.map((res: any) => res._id?.toString()).includes(res?.id?.toString()) ? 'bg-[#0E578C] text-white text-nowrap' : 'bg-[#f4f4f4] text-nowrap'}
                        fontSize={12}
                        value={res}
                        height={"40px"}
                        lineHeight={"15px"}>
                        {res.name}
                    </Tab>
                ))}
            </TabList>
        </Tabs>
    )
}