export const VatCell = (props: {
    taxPercent?: number | undefined | null;
}) => {
    const {taxPercent} = props;
    return (

        <>
            {
                (taxPercent && taxPercent > 0) &&
                <span className={'italic'}>
                    (VAT: {(taxPercent)}%)
                </span>
            }
        </>
    )
}
