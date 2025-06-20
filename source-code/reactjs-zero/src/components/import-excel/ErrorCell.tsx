export const ImportErrorCell = (props: { errors: any[] }) => {
    const {errors} = props;
    return (
        <ul className={"ms-[15px] list-disc"}>
            {errors?.map((error, idx) => (
                <li key={idx} className={"text-red-500"}>
                    {error.message || error}
                </li>
            ))}
        </ul>
    );
};