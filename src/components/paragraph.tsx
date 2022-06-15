export type ParagraphProps = {
    id: string,
    type: "paragraph",
    data: {
        content: string
    }
}
export default function Paragraph(Props: ParagraphProps) {
    return (
        <div id={Props.id} className="mx-4 my-4">
            {Props.data.content}
        </div>
    );
}