let input = document.getElementById("inp");
let result_section = document.getElementById("result");
let container_result = document.getElementById("container_result");
let book_details_section=document.getElementById("book_details");



input.addEventListener("keypress",e =>{
  if(e.key==='Enter')
{
  book_details_section.style.display="none";
  result_section.style.display="block";
  fetchbooks();
} })
function fetchbooks() {
    remove_previous_result();
    remove_previous_book();
  console.log("clicked");
  fetch(`http://openlibrary.org/search.json?q=${input.value}`)
    .then((a) => a.json())
    .then((response) => {
     //console.log(response);
      for (let i = 0; i<(response.docs.length)-1; i++) {
        
        a = response;
        if(('author_name' in response.docs[i]) && ('title' in response.docs[i]) && ('isbn' in response.docs[i]) )
        {
          //console.log(i);
          createbook(i, response);
        }
        
      }
    });
}

function createbook(i, response) {
  let div = document.createElement("div");
  div.setAttribute("class", "a_book");
  div.setAttribute("id", `i-${i}`);
  container_result.appendChild(div);
  let img = document.createElement("img");
  img.setAttribute("id", "cover_img");
  let title = document.createElement("h5");
  title.setAttribute("id", "title");
  let author = document.createElement("h5");
  author.setAttribute("id", "author");
  let view = document.createElement("div");
  view.setAttribute("id", "view_more");
  view.innerText='view more';
  let work_id=response.docs[i].key;
  console.log(typeof work_id);
  
  let d = fetch(
    `http://covers.openlibrary.org/b/isbn/${response.docs[i].isbn[0]}-M.jpg?default=false`
  );
  d.then((res) =>
  { 
    //console.log("all",res,i);
    if(res.status!=200)
    {
        img.src = `images/no_cover.jpg`;
        console.log("not");
    }
    else {
        img.src = `http://covers.openlibrary.org/b/isbn/${response.docs[i].isbn[0]}-M.jpg`;
        img.alt="cover";
        if(i==1 || i==0)
        {
          //console.log(res,i);
        }
        
      }});
  title.innerHTML = `<span>title:</span>${response.docs[i].title}`;
  author.innerHTML = `<span>Author:</span>${response.docs[i]?.author_name[0]}`;
  div.append(img);
  div.append(title);
  div.append(author);
  div.append(view);
  view.addEventListener("click",e=> diplay_book_details(work_id,response.docs[i]?.author_name[0],response.docs[i].title,input.value,img.src,response.docs[i].first_publish_year,response.docs[i].publisher.slice(0,10)));
}
function remove_previous_result()
{while(container_result.firstChild)
{
    container_result.removeChild(container_result.firstChild);
}
}
function diplay_book_details(work_id,author_name,book_title_value,prev_input,img_src,first_publish_year,publisher_){
  book_details_section.style.display="block";
  console.log("hii");
  console.log(work_id);
  let book_details=fetch(`https://openlibrary.org${work_id}.json`)
  .then((a) =>a.json())
    .then((response) => {
      console.log(response);
      result_section.style.display='none';
      let book_description_value;
      console.log(response?.description)
      if (response?.description)
      {
        book_description_value=response.description;
        if(response.description?.value)
        {
          book_description_value=response.description.value
        }
      }
      else
      {
        book_description_value="No description available.";
      }

      console.log(book_description_value);
      //
      let book_title=document.createElement("h5");
      book_title.setAttribute('id','book_title');
      book_title.innerHTML=`<span>${book_title_value}</span>`;
      //
      let book_detail_container=document.createElement("div");
      book_detail_container.setAttribute('id','book_detail_container');
      //
      let book_img=document.createElement('div');
      book_img.setAttribute('class', 'book_img');
      let img=document.createElement('img');
      img.src=img_src;
      book_img.append(img);
      book_detail_container.append(book_img);
      //
      let details=document.createElement('div');
      details.setAttribute('class', 'details');
      let book_author=document.createElement("h5");
      book_author.setAttribute('id','book_author');
      book_author.innerHTML=`Author:<span>${author_name}</span>`;
      details.append(book_author);
      
      let book_publisher=document.createElement('h5');
      book_publisher.setAttribute('id','book_publisher');
      book_publisher.innerHTML=`Publisher:<span>${publisher_}</span>`;
      details.append(book_publisher);
      let book_first_published=document.createElement('div');
      book_first_published.setAttribute('id','book_first_published');
      book_first_published.innerHTML=`First published year:<span>${first_publish_year}</span>`;
      details.append(book_first_published);
      let book_description=document.createElement("h5");
      book_description.setAttribute('id','book_description');
      book_description.innerHTML=`<div>click to view description</div><br><span>${book_description_value}</span>`;
      details.append(book_description);
      book_description.lastChild.style.display='none'
      console.log()
      book_description.addEventListener("click",e=>{console.log(e);book_description.lastChild.style.display='block';book_description.firstChild.innerText="Description:";})
      book_detail_container.append(details);
      //
      let go_back=document.createElement("div");
      go_back.setAttribute('id','back');
      go_back.innerText="Back";
      go_back.addEventListener("click",e=>go_to_prev_results(prev_input))
      //
      book_details_section.append(book_title);
      book_details_section.append(book_detail_container);
      book_details_section.append(go_back);

      

    });
}

function go_to_prev_results(prev_input)
{
  remove_previous_book();
  console.log("going_back");
  book_details_section.style.display="none";
  result_section.style.display="block";
  fetch(`http://openlibrary.org/search.json?q=${prev_input}`)
    .then((a) => a.json())
    .then((response) => {
     //console.log(response);
      for (let i = 0; i<(response.docs.length)-1; i++) {
        
        a = response;
        if(('author_name' in response.docs[i]) && ('title' in response.docs[i]) && ('isbn' in response.docs[i]) )
        {
          //console.log(i);
          createbook(i, response);
        }
        
      }
    });
}
function remove_previous_book()
{while(book_details_section.firstChild)
{
    book_details_section.removeChild(book_details_section.firstChild);
}
}