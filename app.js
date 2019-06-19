const puppeteer = require('puppeteer');
const inquirer = require('inquirer');

puppeteer.launch({ headless: true }).then(async browser => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'movieTitle',
            message: "Enter the title of the movie you want to search:"
        }
    ]).then(async answer => {
        console.log("Searching for movies...");
        const page = await browser.newPage();
        await page.goto(`https://www.imdb.com/find?q=${answer.movieTitle}&s=tt&exact=true&ref_=fn_al_tt_ex`);
        let data = await getFilmsFromTable(page);

        inquirer.prompt([
            {
                type: 'list',
                name: 'relatedTo',
                message: 'Select the movie you want to search related movies of:',
                choices: data.map(movie => {
                    return {
                        name: movie.text,
                        value: movie.link
                    };
                })
            }
        ]).then(async answer => {
            console.log("Searching related movies...");
            await page.goto(answer.relatedTo);
            let data = await getRelatedMovies(page);
            console.log("Related movies:", data.map(movie => movie.title));
            await browser.close();
        });
    });

});

async function getFilmsFromTable(page) {
    return result = await page.evaluate(() => {
        const movies = document.querySelectorAll(".findResult");

        let data = [];
        movies.forEach(movie => {
            let link = movie.querySelector(".result_text > a").href;
            let id = link.split("title/")[1].split("/?")[0];
            data.push({
                "title": movie.querySelector(".result_text > a").textContent,
                "text": movie.textContent.trim(),
                "link": link,
                "id": id
            });
        });

        return data;
    });
}

async function getRelatedMovies(page){
    return result = await page.evaluate(() => {
        const movies = document.querySelectorAll(".rec_item");

        let data = [];
        movies.forEach(movie => {
            let id = movie.dataset.tconst;
            data.push({
                "title": movie.querySelector("a > img").title,
                "link": `https://www.imdb.com/title/${id}/?ref_=tt_rec_tti`,
                "id": id
            });
        });

        return data;
    });
}
