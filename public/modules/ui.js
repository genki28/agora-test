export function renderButtons(state) {
  const { joined, published } = state
  querySelector("#join", HTMLButtonElement).disabled = joined
  querySelector("#publish", HTMLButtonElement).disabled = !joined || published
  querySelector("#unpublish", HTMLButtonElement).disabled = !joined || !published
  querySelector("#leave", HTMLButtonElement).disabled = !joined
}

export function renderUserId(state) {
  const uid = state.currentUserId
  querySelector("#userId", Element).textContent = uid ? String(uid) : "-"
}

export function renderParticipants(state) {
  const elNumber = querySelector("#numOfParticipants", Element)
  elNumber.textContent = String(state.participants.size)

  const elList = querySelector("#participantList", Element)
  elList.innerHTML = ""

  for (const user of state.participants) {
    const el = document.createElement("LI")
    el.textContent = `${user.uid}${state.speakers.has(user)} ? "🎩" : ""`
    elList.appendChild(el)
  }
}

export function querySelector(query, Constructor, from = document) {
  const target = from.querySelector(query)
  if (!target) {
    throw new Error(`Query "${query}" not found`)
  }

  // if (!(target instanceof Constructor)) {
  //   throw new Error(`"${query} is not ${Constructor.name}`)
  // }

  return target
}