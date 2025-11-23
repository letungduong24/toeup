import { CreateProductRequest } from "../dtos/create-product.request";

export interface Product extends CreateProductRequest {
  id: number;
}