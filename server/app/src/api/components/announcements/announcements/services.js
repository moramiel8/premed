const Announcement = require('./db/model');

export function getLast() {
  return Announcement.get(5);
}

export async function getAncsList(filters) {
  const anc = await Announcement.findById(filters.lastAncId);

  if (anc) filters.maxDate = anc.date;
  if (!filters.maxDate) filters.maxDate = new Date();
  if (!filters.minDate) filters.minDate = new Date(1997, 2, 7);

  return Announcement.filterAncs(filters, 10);
}

// Post new announcement
export async function create(data, userId) {
  const groupId =
    data.groupId ??
    (data.group && typeof data.group === 'object' ? data.group.value : data.group);

  const payload = {
    title: data.title,
    content: data.content,
    user: userId,
  };

  if (groupId) payload.group = groupId;

  const newAnc = new Announcement(payload);
  const saved = await newAnc.save();

  //  return with populated group
  return await Announcement.findById(saved._id).populate('group');
}

export async function edit(id, data) {
  const groupId =
    data.groupId ??
    (data.group && typeof data.group === 'object' ? data.group.value : data.group);

  const anc = await Announcement.getByIdOrFail(id);

  if (typeof data.title !== 'undefined') anc.title = data.title;
  if (typeof data.content !== 'undefined') anc.content = data.content;

  if (typeof groupId !== 'undefined') {
    anc.group = groupId || undefined;
  }

  await anc.save();

  // return with populated group
  return await Announcement.findById(anc._id).populate('group');
}

export async function remove(id) {
  const anc = await Announcement.getByIdOrFail(id);
  return anc.remove();
}
