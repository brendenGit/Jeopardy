class Jeopardy {
    constructor() {
        this.categories = [];
        this.catIds = [];
        this.handleClick;
        this.getCategoryIds;
        this.getCategory;
        this.fillTable;
        this.showLoadingView;
        this.hideLoadingView;
        this.setupAndStart();
    }

    // Returns array of category ids
    async getCategoryIds() {
        const response = await axios.get('http://jservice.io/api/categories', { params: { count: 100 } });
        this.catIds = _.sampleSize(response.data.filter((category) => category.clues_count >= 6), 6);
        this.catIds = this.catIds.map((cateogry) => ({ id: cateogry.id }));
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
        const numQuestionsPerCat = 5;

        //select table and create table head and rows
        const table = document.getElementById('jeopardy');
        const tableHead = document.createElement('thead');
        const tableHeadRow = document.createElement('tr');
        tableHead.classList.add('head');

        this.categories.forEach(category => {
            const cateogryHead = document.createElement('td');
            cateogryHead.innerText = category.title.toUpperCase();
            tableHeadRow.append(cateogryHead);
        });
        tableHead.append(tableHeadRow);
        table.append(tableHead);

        //create table body, rows for table body, and cells for table rows
        const tableBody = document.createElement('tbody');
        for (let i = 0; i < numQuestionsPerCat; i++) {
            const tr = document.createElement('tr');
            this.categories.forEach((category, index) => {
                const td = document.createElement('td');
                td.addEventListener('click', this.handleClick);
                td.setAttribute('id', `${index}-${i}`);
                td.innerText = '?';
                tr.append(td);
            })
            tableBody.append(tr);
        }
        table.append(tableBody);
    }


    /** Handle clicking on a clue: show the question or answer.
     *
     * Uses .showing property on clue to determine what to show:
     * - if currently null, show question & set .showing to "question"
     * - if currently "question", show answer & set .showing to "answer"
     * - if currently "answer", ignore click
     * */

    handleClick = (evt) => {
        const id = evt.target.id
        const catIndex = parseInt(id.substring(0, 1));
        const clueIndex = parseInt(id.substring(id.length - 1));
        const clue = this.categories[catIndex].clues[clueIndex]
        if (clue.showing === null) {
            clue.showing = 'question';
            evt.target.innerHTML = clue.question;
        } else if (clue.showing === 'question') {
            clue.showing = 'answer';
            evt.target.innerHTML = clue.answer;
            evt.target.classList.add('showingAnswer');
        }
    }

    /** Wipe the current Jeopardy board, show the loading spinner,
     * and update the button used to fetch data.
     */

    showLoadingView() {
        jeopardy.innerHTML = '';
        startGameBtn.innerText = 'Loading . . .';
        gameContainer.classList.add('game');
    }

    /** Remove the loading spinner and update the button used to fetch data. */

    hideLoadingView() {
        startGameBtn.innerText = 'Start New Game';
        gameContainer.classList.remove('game');
    }

    /** Start game:
     *
     * - get random category Ids
     * - get data for each category
     * - create HTML table
     * */

    async setupAndStart() {
        this.showLoadingView();
        await this.getCategoryIds();
        for (const catId of this.catIds) {
            await this.getCategory(catId.id);
        }
        await this.fillTable();
        this.hideLoadingView();
    }
}


// selectors
const startGameBtn = document.getElementById('startGame');
const gameContainer = document.getElementById('gameContainer');
const jeopardy = document.getElementById('jeopardy');



/** On click of start / restart button, set up game. */

startGameBtn.addEventListener('click', startGameHandle)

function startGameHandle(evt) {
    new Jeopardy;
}

/** On page load, add event handler for clicking clues */

// TODO
