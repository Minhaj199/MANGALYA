


const array=['sadya']

const item=[
    {interest:[]},
    {interest:['sadya']},
    {interest:['sadya','movie']},
    {interest:['movie']},
    {interest:['kala','movie']},
    {interest:['kala','sadya']},
]

const am=item.filter(el=>{
    return array.every((em)=>el.interest.includes(em))

})
console.log(am)