export class Recipes {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  ingrediends: Ingrediends[];

  constructor(
    id: string,
    name: string,
    description: string,
    imageUrl: string,
    ingrediends: Ingrediends[]
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
    this.ingrediends = ingrediends;
  }
}
export class Ingrediends {
  name: string;
  amount: number;
  constructor(name: string, amount: number) {
    this.name = name;
    this.amount = amount;
  }
}
