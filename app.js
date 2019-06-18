const puppeteer = require('puppeteer');

puppeteer.launch({ headless: true }).then(async browser => {
    const page = await browser.newPage();
    await page.goto("https://www.imdb.com/find?q=cars&s=tt&exact=true&ref_=fn_al_tt_ex");
    let data = await getFilmsFromTable(page);
    console.log(data);
    await browser.close();
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
