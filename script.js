fetch('OpenDay.json')
  .then(response => response.json())
  .then(data => {
    renderOpenDayInfo(data); // Open day info     
    topicsDropDown(data.topics); // Filter by topic
    renderProgrammes(data.topics); // Programme info

    document.querySelector('#topicFilter').addEventListener('change', function (e) {
      const selectedTopicId = e.target.value;
      let filteredTopics;

      if (selectedTopicId == 'all') {
        filteredTopics = data.topics;
      } else {
        filteredTopics = [];
        data.topics.forEach(topic => {
          if (topic.id == selectedTopicId){
            filteredTopics.push(topic);
          }
        });
      }

      renderProgrammes(filteredTopics);
    });

  })
  .catch(error => console.error(error));


function renderOpenDayInfo(data) {
  const startTime = data.start_time.slice(11, 16);
  const endTime = data.end_time.slice(11, 16);
  const date = data.start_time.slice(0, 10);

  document.querySelector('.open-day-date').innerHTML = `<strong>Date and time:</strong> ${date}, ${startTime} – ${endTime}`;
  if (data.type == 'U'){
    document.querySelector('.open-day-type').innerHTML = `<strong>Type:</strong> Undergraduate Open Day`;
  }
};


function topicsDropDown(topics) {
  const dropDown = document.querySelector("#topicFilter");
  
  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = 'All topics';
  dropDown.appendChild(allOption);

  topics.forEach(topic => {
    const topicName = topic.name;
    const topicID = topic.id;
    const option = document.createElement('option');
    option.value = topicID;
    option.textContent = topicName;
    dropDown.appendChild(option);
  });
};


function renderProgrammes(topics) {
  const main = document.querySelector('.main-container');
  main.innerHTML = '';
  topics.forEach(topic => {
    const topicSection = document.createElement('section');
    topicSection.classList.add('container-fluid', 'topic-section');
    topicSection.innerHTML = `<h3>${topic.name}</h3> `;

    const programRow = document.createElement('div')
    programRow.classList.add('row', 'g-3', 'd-flex');

    topic.programs.forEach(program => {
      if (program.active == 1){
        const programCard = renderProgrammeCard(program);
        programRow.appendChild(programCard);
      }
    })

    topicSection.appendChild(programRow);

    main.appendChild(topicSection);
    main.appendChild(document.createElement('hr'));

  });
}


function renderProgrammeCard(program) {
  const col = document.createElement('div');
  col.classList.add('col-md-6', 'col-lg-3', 'mb-4');

  const card = document.createElement('div');
  card.classList.add('card', 'h-100');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body', 'd-flex', 'flex-column');

  const title = document.createElement('h5');
  title.classList.add('card-title', 'fw-bold', 'text-dark', 'fs-5');
  title.textContent = program.title;

  const content = document.createElement('div');
  content.classList.add('card-text');

  const time = document.createElement('p');
  time.classList.add('programme-text');
  time.innerHTML = `<strong>Time:</strong> ${program.start_time.slice(11, 16)} - ${program.end_time.slice(11, 16)}`;

  const location = document.createElement('p');
  location.classList.add('programme-text');
  location.innerHTML = `<strong>Location:</strong> ${program.room || ''}, ${program.location.title}`;

  const type = document.createElement('p');
  type.classList.add('programme-text');
  type.innerHTML = `<strong>Event Type:</strong> ${program.programType.type}`;

  const description = document.createElement('p');
  description.classList.add('text-secondary', 'programme-text');
  description.textContent = program.description_short;

  content.append(time, location, type, description);
  cardBody.append(title, content);
  card.append(cardBody);
  col.append(card);

  return col;
}

 

