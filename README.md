# JSON Conditions

Mongo conditions without mongo.

## Installation

`npm i @hixme/json-conditions --save`

## Usage

```js
import conditions from '@hixme/json-conditions'

const rules = conditions({
    name: 'bob',
});

rules({
    name: 'bob',
    activities: 'walking',
}); // returns true
```

## API

### $and

```js
const rules = conditions({$and: [{$gt: 1}, {$lt: 10}]})
rules(4) // true
rules(40) // false
```

### $or

```js
const rules = conditions({$or: [{$lt: 10}, {$gt: 20}]})
rules(4) // true
rules(40) // true
rules(15) // false
```

```js
const rules = conditions({$or: {
    name: 'bob',
    food: 'sushi',
}})
rules({name: 'bob'}) // true
rules({food: 'sushi'}) // true
rules({name: 'randy'}) // false
```

### $not

```js
const rules = conditions({$not: {$lt: 10}})
rules(20) // true
rules(4) // false
```

### $gt

```js
const rules = conditions({$gt: 10})
rules(20) // true
rules(10) // false
rules(4) // false
```

### $gte

```js
const rules = conditions({$gte: 10})
rules(20) // true
rules(10) // true
rules(4) // false
```

### $lt

```js
const rules = conditions({$lt: 10})
rules(20) // false
rules(10) // false
rules(4) // true
```

### $lte

```js
const rules = conditions({$lte: 10})
rules(20) // false
rules(10) // true
rules(4) // true
```

### $eq

```js
const rules = conditions({$eq: 10})
rules(20) // false
rules(10) // true
```

### $ne

```js
const rules = conditions({$ne: 10})
rules(10) // false
rules(20) // true
```

### $like

Case insensitive match

```js
const rules = conditions({$like: 'Bob%'})
rules('bob') // true
rules('BOBBY') // true
rules('randy') // false
```

### $oneOf

```js
const rules = conditions({$oneOf: ['hello', 'world']})
rules('hello') // true
rules('world') // true
rules('bob') // false
```

### $includes

```js
const rules = conditions({$includes: 'bob'})
rules(['hello', 'world']) // false
rules(['bill', 'bob']) // true
```
