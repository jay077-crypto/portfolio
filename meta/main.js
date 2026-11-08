import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

async function loadData() {
  const data = await d3.csv('loc.csv', (row) => ({
    ...row,
    line: Number(row.line),
    depth: Number(row.depth),
    length: Number(row.length),
    date: new Date(row.date + 'T00:00' + row.timezone),
    datetime: new Date(row.datetime),
  }));

  return data;
}

function processCommits(data) {
  return d3.groups(data, (d) => d.commit).map(([commit, lines]) => {
    const { author, date, time, timezone, datetime } = lines[0];

    const ret = {
      id: commit,
      url: `https://github.com/jay077-crypto/portfolio/commit/${commit}`,
      author,
      date,
      time,
      timezone,
      datetime,
      hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
      totalLines: lines.length,
    };

    Object.defineProperty(ret, 'lines', {
      value: lines,
      enumerable: false,
    });

    return ret;
  });
}

function renderCommitInfo(data, commits) {
  const dl = d3.select('#stats').append('dl').attr('class', 'stats');

  const fileLengths = d3.rollups(
    data,
    (lines) => d3.max(lines, (d) => d.line),
    (d) => d.file,
  );

  dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
  dl.append('dd').text(data.length);

  dl.append('dt').text('Total commits');
  dl.append('dd').text(commits.length);

  dl.append('dt').text('Files');
  dl.append('dd').text(fileLengths.length);

  dl.append('dt').text('Max depth');
  dl.append('dd').text(d3.max(data, (d) => d.depth));

  dl.append('dt').text('Longest line (characters)');
  dl.append('dd').text(d3.max(data, (d) => d.length));

  dl.append('dt').text('Max lines in a file');
  dl.append('dd').text(d3.max(fileLengths, ([file, length]) => length));
}

let data = await loadData();
let commits = processCommits(data);

renderCommitInfo(data, commits);