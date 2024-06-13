import React, { useContext } from 'react'
import {ShopContext} from '../Context/ShopContext'
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrums';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';

const Product = () => {
  const {all_product}= useContext(ShopContext);
  console.log('all_products',all_product);
  const {productId}=useParams();
  console.log('productId',productId);
  const Product=all_product.find((e)=>e.id===Number(productId));
  return (
    <div>
      <Breadcrum product={Product}/>
      <ProductDisplay product={Product}/>      
      <DescriptionBox/>  
      <RelatedProducts/>
    </div>
  )
}

export default Product
