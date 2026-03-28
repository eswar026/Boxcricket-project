let booked = JSON.parse(localStorage.getItem("booked")) || {};

let from = document.getElementById("from");
let to = document.getElementById("to");
let total = document.getElementById("total");
let receipt = document.getElementById("receipt");
let rname = document.getElementById("rname");
let rphone = document.getElementById("rphone");
let rdate = document.getElementById("rdate");
let rtime = document.getElementById("rtime");
let ramount = document.getElementById("ramount");

// Add time options
for(let i=6;i<=21;i++){
  from.innerHTML += `<option value="${i}">${i}:00</option>`;
}

for(let i=7;i<=22;i++){
  to.innerHTML += `<option value="${i}">${i}:00</option>`;
}

// Calculate total
function calculateTotal(){
  let fromTime = parseInt(from.value);
  let toTime = parseInt(to.value);

  if(toTime > fromTime){
    total.value = "₹" + (toTime - fromTime) * 1000;
  } else {
    total.value = "";
  }
}

from.addEventListener("change", calculateTotal);
to.addEventListener("change", calculateTotal);

// Format date
function formatDate(date){
  let d = new Date(date);
  let day = String(d.getDate()).padStart(2,'0');
  let month = String(d.getMonth()+1).padStart(2,'0');
  let year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

// Book slot
function book(){
  let name = document.getElementById("name").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let date = document.getElementById("date").value;
  let fromTime = parseInt(from.value);
  let toTime = parseInt(to.value);
  let payment = document.getElementById("payment").value;

  if(!name || !phone || !date || !payment){
    alert("Please fill all details");
    return;
  }

  if(toTime <= fromTime){
    alert("Invalid time selection");
    return;
  }

  for(let i=fromTime;i<toTime;i++){
    if(booked[`${date}_${i}`]){
      alert("Selected slot already booked");
      return;
    }
  }

  alert("Payment Successful!");

  for(let i=fromTime;i<toTime;i++){
    booked[`${date}_${i}`] = {name, phone};
  }

  localStorage.setItem("booked", JSON.stringify(booked));

  receipt.style.display = "block";
  rname.innerHTML = "Name: " + name;
  rphone.innerHTML = "Phone: " + phone;
  rdate.innerHTML = "Date: " + formatDate(date);
  rtime.innerHTML = `Time: ${fromTime}:00 to ${toTime}:00`;
  ramount.innerHTML = `Total Paid: ₹${(toTime-fromTime)*1000}`;

  showBookings();
}

// Show bookings
function showBookings(){
  let table = document.getElementById("bookingTable");
  table.innerHTML = "";

  let keys = Object.keys(booked);

  if(keys.length === 0){
    table.innerHTML = `<tr><td colspan="4">No bookings yet</td></tr>`;
    return;
  }

  keys.forEach(key=>{
    let [date, time] = key.split("_");

    table.innerHTML += `
      <tr>
        <td>${formatDate(date)}</td>
        <td>${time}:00 - ${parseInt(time)+1}:00</td>
        <td>${booked[key].name}</td>
        <td>${booked[key].phone}</td>
      </tr>
    `;
  });
}

showBookings();
