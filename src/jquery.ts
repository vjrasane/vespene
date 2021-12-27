import $ from "jquery";

const cleanData = $.cleanData;
$.cleanData = (elems) => {
  Array.from(elems).forEach((elem) => {
    try {
      // Only trigger remove when necessary to save time
      /* @ts-expect-error */
      const events = $._data(elem, "events");
      if (events && events.remove) {
        $(elem).triggerHandler("remove");
      }
      // Http://bugs.jquery.com/ticket/8235
    } catch (e) {}
  });
  cleanData(elems);
};

export default $;
