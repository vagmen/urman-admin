const immutable = (obj) => (
  Object.freeze(obj),
  void 0 === obj
    ? obj
    : (Object.getOwnPropertyNames(obj).forEach(
        (prop) =>
          !Object.isFrozen(obj[prop]) &&
          (typeof obj[prop] === 'object' || typeof obj[prop] === 'function') &&
          immutable(obj[prop])
      ),
      obj)
);

export const FORM_ITEM_LAYOUT = immutable({
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
});

export const FORM_ITEM_LAYOUT_WITH_EXTRA = immutable({
  labelCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
});

export const VALIDATION_RULES = [
  {
    required: true,
    message: 'Поле обязательно',
  },
];
export const SCHEDULE_TYPES = immutable({
  SIMPLE: '66c006ed-d12a-4a19-92a8-eea2082881f9',
  DUPLICATE: 'ab9da2c2-3228-49ef-acbd-3cc99355b3c2',
});

export const PERIODICITY_TYPES = immutable({
  MONTH: 'c5d2d7e0-1bd5-46a8-80b9-8f96f1abb2f4',
  WEEK: 'b8a5ab31-0f25-4957-ba0a-d221903f8c99',
  DAY: 'aff21a16-d19a-403f-b71c-56c5f8b8b0ed',
  HOUR: '0da513c6-6c67-4137-9b9c-f47044cbc455',
  MINUTE: '2', // заменить как бек даст id
  SECOND: '3', // заменить как бек даст id
});

export const PERIODICITY = immutable({
  [PERIODICITY_TYPES.MONTH]: { EXTRA: 'мес', MAX: 12 },
  [PERIODICITY_TYPES.WEEK]: { EXTRA: 'нед', MAX: 52 },
  [PERIODICITY_TYPES.DAY]: { EXTRA: 'дн', MAX: 31 },
  [PERIODICITY_TYPES.HOUR]: { EXTRA: 'час', MAX: 23 },
  [PERIODICITY_TYPES.MINUTE]: { EXTRA: 'минут', MAX: 59 },
  [PERIODICITY_TYPES.SECOND]: { EXTRA: 'секунд', MAX: 59 },
});
