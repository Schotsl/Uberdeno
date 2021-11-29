# Uberdeno

This repository contains some code snippets I use in every Deno project, with
the power of Deno I can import it through the URL! Every import works fine
within Deno deploy for almost instant deployments.

# Validation

## Strings [string.ts](https://github.com/Schotsl/Uberdeno/blob/main/validation/string.ts)

### `validateString(input: unknown, label: string, optional = false)`
**Valid input:** `"This is a test"`  
**Invalid input:** `true`

### `validateDate(input: unknown, label: string, optional = false)`
**Valid input:** `"2021-11-29T15:46:12.367Z"`  
**Invalid input:** `"29/11/2021"`

### `validateEmail(input: unknown, label: string, optional = false)`
**Valid input:** `"email@example.com"`  
**Invalid input:** `"email.example.com"`

### `validateTime(input: unknown, label: string, optional = false)`
**Valid input:** `"23:59"`  
**Invalid input:** `"24:00"`

### `validateUUID(input: unknown, label: string, optional = false)`
**Valid input:** `"272e1c01-237a-48e3-b88a-96a6fe9d3edb"`  
**Invalid input:** `"123"`

### `validateVarchar(input: unknown, label: string, optional = false)`
**Valid input:** `"This string is longer than 2 characters but shorter than 256"`  
**Invalid input:** `"Hi"`

## Numbers [number.ts](https://github.com/Schotsl/Uberdeno/blob/main/validation/number.ts)

### `validateNumber(input: unknown, label: string, optional = false)`
**Valid input:** `1`  
**Invalid input:** `"1"`

### `validateTinyint(input: unknown, label: string, optional = false)`
**Valid input:** `-128`, `127`  
**Invalid input:** `-129`, `128`  

### `validateSmallInt(input: unknown, label: string, optional = false)`
**Valid input:** `-32768`, `32767`  
**Invalid input:** `-32769`, `32768`  

### `validateInt(input: unknown, label: string, optional = false)`
**Valid input:** `-2147483648`, `2147483647`  
**Invalid input:** `-2147483649`, `2147483648`  

## Booleans [boolean.ts](https://github.com/Schotsl/Uberdeno/blob/main/validation/boolean.ts)

### `validateBoolean(input: unknown, label: string, optional = false)`
**Valid input:** `true`  
**Invalid input:** `"true"`