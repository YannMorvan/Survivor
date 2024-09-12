function sendPostRequest(url, data)
{
    const formData = new FormData();

    for (const key in data) {
        formData.append(key, data[key]);
    }

    return fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }
        return response.text();
    });
}


async function run() {
  const loginResponse = await sendPostRequest("./login.php", {
    email: "jeanne.martin@soul-connection.fr",
    password: "naouLeA82oeirn",
  })
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
      return response;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });

  if (!loginResponse) {
    return;
  }

  // Add test here

  /*
  sendPostRequest("./table_clients.php", {})
    .then((response) => {
      console.log(response);
      response = JSON.parse(response);
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });

//  sendPostRequest("./client_profile.php", { id: 3 })
//    .then((response) => {
//      response = JSON.parse(response);
//      console.log(response);
//    })
//    .catch((error) => {
//      console.error(error);
//    });
//

  sendPostRequest("./clothes_types.php", {})
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });

  sendPostRequest("./clothes_data.php", { type: "shoes" })
    .then((response) => {
      console.log(response);
      response = JSON.parse(response);
    })
    .catch((error) => {
      console.error(error);
    });
  sendPostRequest("./astrological_sign_data.php", {})
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
  sendPostRequest("./employes_table.php", {})
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
  sendPostRequest("./statistics.php", {})
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
  sendPostRequest("./add_employee_to_db.php", {
    email: "JhonDoe@gmail.com",
    name: "Jhon",
    surname: "Doe",
    birth_date: "2001-09-11",
    gender: "Male",
    work: "None",
  })
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
  sendPostRequest("./get_clothes_by_user_id.php", { id: 1 })
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
  sendPostRequest("./edit_employees.php", {
    id: 1,
    email: "test",
    name: "test",
    surname: "test",
    phone_number: "0000000000",
  })
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
    })
    .catch((error) => {
      console.error("Test: " + error);
    });
  sendPostRequest("./edit_customer.php", {
    id: "1",
    id_coach: "2",
    email: "thérèse.georme@gmail.com",
    phone_number: "05 62 41 23 65",
    address: "12 avenue Carpentier 41925 Besnard-la-Forêt",
    country: "France",
    name: "thérèse",
    surname: "georme",
    birth_date: "1981-08-10",
    gender: "female",
    description:
      " am looking for someone to share moments of complicity and laughter with.",
    astrological_sign: "Leo",
  })
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
  sendPostRequest("./create_event.php", {
    id: "302",
    id_employee: "5",
    name: "test",
    date: "2021-09-11",
    duration: "220",
    type: "Trivia",
    max_participants: "5",
    location_x: "48",
    location_y: "12",
    location_name: "Here",
  })
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
  sendPostRequest("./edit_event.php", {
    id: "302",
    id_employee: "5",
    name: "test",
    date: "2021-09-11",
    duration: "220",
    type: "Trivia",
    max_participants: "7",
    location_x: "48",
    location_y: "12",
    location_name: "Here",
  })
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
  sendPostRequest("./get_coach.php", { id: "48" })
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
  sendPostRequest("./create_event.php", {
    name: "test",
    date: "2021-09-11",
    duration: "220",
    type: "Trivia",
    max_participants: "5",
    location_x: "48",
    location_y: "12",
    location_name: "Here",
  })
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
  sendPostRequest("./get_coach_data.php", {})
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
    sendPostRequest("./get_coach.php", { id: "48" })
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
    sendPostRequest("./last_week_events.php", {})
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
    }).catch((error) => {
      console.error(error);
    });
    sendPostRequest("./last_week_customers.php", {})
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
    }).catch((error) => {
      console.error(error);
    });
    sendPostRequest("./table_clients.php", { is_coach : true})
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
    }).catch((error) => {
      console.error(error);
    });
    sendPostRequest("./employee_image.php", { id: 7})
    .then((response) => {
      console.log(response);
    }).catch ((error) => {
      console.error(error);
    });
    sendPostRequest("./last_week_customers.php", {})
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
    }).catch ((error) => {
      console.error(error);
    });
    sendPostRequest("./last_month_customers.php", {})
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
    }).catch ((error) => {
      console.error(error);
    });
    sendPostRequest("./last_week_encounters.php", {})
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
    }).catch ((error) => {
      console.error(error);
    });
    sendPostRequest("./last_month_encounters.php", {})
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
    }).catch ((error) => {
      console.error(error);
    });
    sendPostRequest("./last_week_events.php", {})
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
    }).catch ((error) => {
      console.error(error);
    });*/
    sendPostRequest("./last_month_customers.php", {})
    .then((response) => {
      response = JSON.parse(response);
      console.log(response);
    }).catch ((error) => {
      console.error(error);
    });


    console.log("End of tests !");
}

run();
