import { Money } from '../value-objects/Money';
import { ProductCategory } from '../types';

export interface ProductProps {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: Money;
  stock: number;
  icon: string;
  colorGradient: string;
  imageUrl?: string;
}

/**
 * Domain Entity: Product
 * Represents a university cafeteria sellable item with rich domain logic
 */
export class Product {
  private readonly _id: string;
  private _name: string;
  private _category: ProductCategory;
  private _description: string;
  private _price: Money;
  private _stock: number;
  private _icon: string;
  private _colorGradient: string;
  private _imageUrl?: string;

  constructor(props: ProductProps) {
    if (!props.id || props.id.trim() === '') {
      throw new Error('Product ID cannot be empty');
    }
    if (!props.name || props.name.trim() === '') {
      throw new Error('Product name cannot be empty');
    }
    if (props.stock < 0) {
      throw new Error('Initial stock cannot be negative');
    }

    this._id = props.id;
    this._name = props.name;
    this._category = props.category;
    this._description = props.description;
    this._price = props.price;
    this._stock = props.stock;
    this._icon = props.icon;
    this._colorGradient = props.colorGradient;
    this._imageUrl = props.imageUrl;
  }

  // Getters
  public get id(): string { return this._id; }
  public get name(): string { return this._name; }
  public get category(): ProductCategory { return this._category; }
  public get description(): string { return this._description; }
  public get price(): Money { return this._price; }
  public get stock(): number { return this._stock; }
  public get icon(): string { return this._icon; }
  public get colorGradient(): string { return this._colorGradient; }
  public get imageUrl(): string | undefined { return this._imageUrl; }

  // Business Invariants & Logic
  public isAvailable(): boolean {
    return this._stock > 0;
  }

  public isOutOfStock(): boolean {
    return this._stock <= 0;
  }

  public isLowStock(): boolean {
    return this._stock > 0 && this._stock <= 3;
  }

  public canFulfill(quantity: number = 1): boolean {
    return this._stock >= quantity && quantity > 0;
  }

  public decrementStock(quantity: number = 1): void {
    if (quantity <= 0) {
      throw new Error('Quantity to decrement must be greater than zero');
    }
    if (!this.canFulfill(quantity)) {
      throw new Error(`Insufficient stock for "${this._name}". Current: ${this._stock}, Requested: ${quantity}`);
    }
    this._stock -= quantity;
  }

  public replenishStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity to replenish must be greater than zero');
    }
    this._stock += quantity;
  }

  public adjustStock(delta: number): void {
    const nextStock = this._stock + delta;
    this._stock = Math.max(0, nextStock);
  }

  public clone(): Product {
    return new Product({
      id: this._id,
      name: this._name,
      category: this._category,
      description: this._description,
      price: Money.from(this._price.getAmount()),
      stock: this._stock,
      icon: this._icon,
      colorGradient: this._colorGradient,
      imageUrl: this._imageUrl
    });
  }
}
