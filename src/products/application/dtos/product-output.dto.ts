export class ProductOutputDto {
  id: string
  name: string
  price: number
  quantity: number
  created_at: Date
  updated_at: Date

  constructor(data: Partial<ProductOutputDto>) {
    this.id = data.id
    this.name = data.name
    this.price = data.price
    this.quantity = data.quantity
    this.created_at = data.created_at
    this.updated_at = data.updated_at
  }
}
