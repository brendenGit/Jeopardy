class Jeopardy {
    constructor() {
        this.categories = [];
        this.setupAndStart();
    }

    // Returns array of category ids
    async getCategoryIds() {
        const response = await axios.get('http://jservice.io/api/categories', { params: { count: 100 } });
        let catIds = _.sampleSize(response.data.filter((category) => category.clues_count >= 6), 6);
        catIds = catIds.map((cateogry) => ({ id: cateogry.id }));
        catIds.forEach((category) => getCategory(category.id));
    }

    /** Return object with data about a category:
     *
     *  Returns { title: "Math", clues: clue-array }
     *
     * Where clue-array is:
     *   [
     *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
     *      {question: "Bell Jar Author", answer: "Plath", showing: null},
     *      ...
     *   ]
     */
    async getCategory(catId) {
        const response = await axios.get('http://jservice.io/api/category?', { params: { id: catId } });
        const clues = _.sampleSize(response.data.clues.map(({ question, answer }) => ({ question, answer, showing: null })), 5);
        const data = { title: response.data.title, clues };
        this.categories.push(data);
    }

    /** Fill the HTML table#jeopardy with the categories & cells for questions.
     *
     * - The <thead> should be filled w/a <tr>, and a <td> for each category
     * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
     *   each with a question for each category in a <td>
     *   (initally, just show a "?" where the question/answer would go.)
     */

    async fillTable() {
        const table = document.getElementById('jeopardy');
        const tableHead = document.createElement('thead');
        const tableHeadRow = document.createElement('tr');
        this.categories.forEach(category => {
            const cateogryHead = document.createElement('td');
            cateogryHead.innerText = category.title;
            tableHeadRow.append(cateogryHead);
        });
        tableHead.append(tableHeadRow);
        table.append(tableHead);
        const tableBody = document.createElement('tbody');
        
    }

    /** Handle clicking on a clue: show the question or answer.
     *
     * Uses .showing property on clue to determine what to show:
     * - if currently null, show question & set .showing to "question"
     * - if currently "question", show answer & set .showing to "answer"
     * - if currently "answer", ignore click
     * */

    handleClick(evt) {
    }

    /** Wipe the current Jeopardy board, show the loading spinner,
     * and update the button used to fetch data.
     */

    showLoadingView() {

    }

    /** Remove the loading spinner and update the button used to fetch data. */

    hideLoadingView() {
    }

    /** Start game:
     *
     * - get random category Ids
     * - get data for each category
     * - create HTML table
     * */

    async setupAndStart() {
    }
}



/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO
