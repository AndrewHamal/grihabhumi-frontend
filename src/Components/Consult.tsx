import { postConsult } from "@/pages/api/api"
import { Button, Input, Textarea } from "@chakra-ui/react"
import { useState } from "react"
import { toast } from "react-toastify"

export default function Consult({ prop, type = 'property' }: any) {
    const [submitting, setSubmitting] = useState(false)

    function handleConsult(e: any) {
        e.preventDefault()
        setSubmitting(true)
        let formData = new FormData(e.target)

        postConsult(formData)
            .then(res => {
                e.target.reset()
                toast.success(res?.data?.message)
                setSubmitting(false)
            }).catch(err => {
                setSubmitting(false)
            })
    }
    return (
        <div className="border-[1px] p-5 text-center rounded-[12px] mt-6">
            <h5 className="text-left text-[16px] text-gray-700 font-[500] mb-3">Contact</h5>

            <form method="POST" onSubmit={handleConsult}>
                <Input type="text" name="name" fontSize={14} required className="mb-3" placeholder="Name *" />
                <Input type="tel" name="phone" fontSize={14} required className="mb-3" placeholder="Phone *" />
                <Input type="email" name="email" fontSize={14} className="mb-3" placeholder="Email" />
                <Input type="text" disabled={true} fontSize={14} className="mb-3" value={prop?.name} placeholder="" />
                <input type="hidden" name="data_id" value={prop?.id} />
                <input type="hidden" value={type} name="type" />
                <Textarea required name="content" fontSize={14} placeholder="Message" />

                <div className="text-left mt-5">
                    <Button isLoading={submitting} loadingText="Submitting" type="submit" colorScheme="blue" fontWeight={400} fontSize={14}>Submit</Button>
                </div>
            </form>
        </div>
    )
}