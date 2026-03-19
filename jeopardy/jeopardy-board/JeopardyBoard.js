import { FlipCard } from "../flip-card/FlipCard.js"

class JeopardyBoard extends HTMLElement {
  #data = [] 
  constructor(){
    super()
  }

  async fetch(url){
    let response = await fetch(url)
    let data = await response.json()
    this.data = data
  }

  connectedCallback(){

  }

  static get observedAttributes(){
    return ["src"]
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == "src"){
      this.fetch(newValue)
    }
  }

  set data(questions){
    this.#data = questions
    this.render()
  }

  get data(){
    return this.#data
  }

  sortDataByCategoryAndValue(){
      let byCategory = Object.groupBy(this.data, question => question.category) 
      for(let category in byCategory){
        byCategory[category].sort((a, b) => a.value - b.value)
      }
      return byCategory
  }

  render(){
    let byCategory = this.sortDataByCategoryAndValue()

    Object.entries(byCategory)
      .forEach(([category, questions]) => {
        let categoryHeader = document.createElement("h2")
        categoryHeader.textContent = category
        this.appendChild(categoryHeader)

        questions.forEach(question => {
          let card = new FlipCard()
          card.data = question
          this.appendChild(card)
        })
      })

    
  }
}

export {JeopardyBoard}
customElements.define('jeopardy-board', JeopardyBoard)
