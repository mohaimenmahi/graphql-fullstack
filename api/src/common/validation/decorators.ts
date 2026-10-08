import { Transform } from "class-transformer";
import { registerDecorator, type ValidationOptions } from "class-validator";

/** PropertyDecorator: for the properties of objects and DTOs
When we use @Trim() before any property, typescript infers that property to send into the transformer's
parameter. @ sign helped typescript to smartly identify this.
In python, we also need to add parameters to the main decorator to point out which one will 
go under the decorator, same as the IsNotFutureYear decorator. Infact, it does not have Trasnformers
so we need to implement it by taking (target, property) parameters
*/
export function Trim(): PropertyDecorator {
  return Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  ) as PropertyDecorator;
}

// Trim and lowercase (emails)
export function Normalize(): PropertyDecorator {
  return Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim().toLowerCase() : value,
  ) as PropertyDecorator;
}

// Remove duplicates from an array input (e.g: gereIds)
export function Unique(): PropertyDecorator {
  return Transform(({ value }: { value: unknown }) =>
    Array.isArray(value) ? [...new Set(value)] : value,
  ) as PropertyDecorator;
}

// Year must not be in future
export function IsNotFutureYear(options?: ValidationOptions): PropertyDecorator {
  return (target, propertyName) => {
    registerDecorator({
      name: 'isNotFutureYear',
      target: target.constructor,
      propertyName: propertyName as string,
      options: { message: 'Year cannnot be in the future...', ...options},
      validator:  {
        validate: (value: unknown) =>
          typeof value !== 'number' || value <= new Date().getFullYear(),
      }
    })
  }
}
