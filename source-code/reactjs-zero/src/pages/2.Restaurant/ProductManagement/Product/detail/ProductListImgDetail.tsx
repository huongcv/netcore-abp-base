import {Space} from "antd";
import {ProductImgDetail} from "@pages/ProductManagement/Product/detail/ProductImgDetail";
import {ProductDto} from "@api/index.defs";

export const ProductListImgDetail = (props: {
    productDto: ProductDto,
    hashId: string | null | undefined;
}) => {
    const {productDto, hashId: id} = props;
    return (<Space.Compact>
        <Space className='me-3 align-top text-center'>
            <ProductImgDetail value={productDto.imageUrl}
                              imgIndex={0}
                              productId={id}
            />
        </Space>
        <Space className='me-3 align-top'>
            <ProductImgDetail value={productDto.imageUrl1}
                              imgIndex={1}
                              productId={id}/>
        </Space>
        <Space className='me-3 align-top'>
            <ProductImgDetail value={productDto.imageUrl2}
                              imgIndex={2}
                              productId={id}/>
        </Space>
        <Space className='me-3 align-top'>
            <ProductImgDetail value={productDto.imageUrl3}
                              imgIndex={3}
                              productId={id}/>
        </Space>
        <Space className='me-3 align-top'>
            <ProductImgDetail value={productDto.imageUrl4}
                              imgIndex={4}
                              productId={id}/>
        </Space>
    </Space.Compact>)
        ;
}
