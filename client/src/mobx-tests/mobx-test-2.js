class Person {
  @observable age = 30
  @observable firstName = "Foo"
  @observable lastName = "Bar"
  
  constructor(){
    console.log('constructor()')
  }

  @computed get displayName() {
    console.log("displayName()")
    return this.firstName + ' ' + this.lastName
  }
  @computed get yearOfBirth() {
    console.log("yearOfBirth()")
    return new Date().getFullYear() - this.age
  } 
}

var p = new Person();

autorun(() => {
  
  console.dir(p.age + ' ' + p.displayName + ' ' + p.yearOfBirth)
})

console.log('------------')
//calls get displayName() only
p.firstName =  "John"
console.log('------------')
//calls get uearofBirth() only
p.age = 31;