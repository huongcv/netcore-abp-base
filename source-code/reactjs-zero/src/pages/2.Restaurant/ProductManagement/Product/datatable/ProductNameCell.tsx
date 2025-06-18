import { ProductDto } from "@api/index.defs";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { ImgFromFileId } from "@ord-components/common/img/ImgFromFileId";
import { Popover, Space } from "antd";
import { Tag } from "antd/lib";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export const ProductNameCell = (props: {
  product: ProductDto | null | undefined;
}) => {
  const [t] = useTranslation("product");
  const { product } = props;
  const [hovered, setHovered] = useState<boolean | null | undefined>(false);
  const navigate = useNavigate();
  const handleClick = () => {
    // navigate('/product/detail/' + product?.idHash);
  };
  const content = (
    <div>
      <ImgFromFileId fileId={product?.imageUrl} width={80} />
    </div>
  );
  const linkGoToDetail = (
    <span
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ color: "#1890ff" }}
    >
      {/* cursor: 'pointer', */}
      {product?.productName}
    </span>
  );
  return (
    <>
      <Space wrap>
        <Space className={"me-2"}>
          {product && product?.imageUrl && product?.productName ? (
            <Popover placement="left" content={content}>
              {linkGoToDetail}
            </Popover>
          ) : (
            linkGoToDetail
          )}
        </Space>
        {/*{*/}
        {/*    product?.isProductUseInventory == true &&*/}
        {/*    <>*/}
        {/*        <Tag  icon={<CheckCircleOutlined/>} color="success">*/}
        {/*            {t('IsProductUseInventory')}*/}
        {/*        </Tag>*/}
        {/*    </>*/}
        {/*}*/}
        {/*{*/}
        {/*    product?.isStatic == true &&*/}
        {/*    <>*/}
        {/*        <Tag icon={<CheckCircleOutlined/>} color="success">*/}
        {/*            {t('isStaticProductOfTenant')}*/}
        {/*        </Tag>*/}

        {/*    </>*/}
        {/*}*/}
        {product?.isProductUseLotNumber == true && (
          <>
            <Tag icon={<CheckCircleOutlined />} color="processing">
              {t("IsProductUseLotNumber")}
            </Tag>
          </>
        )}
      </Space>
    </>
  );
};
