INSERT INTO district (id, name)
VALUES (
  1, 'BSD'
);

INSERT INTO schools (id, name, district)
VALUES (
  1, 'Beardsley Elementary', 1
), (
  2, 'Beardsley Junior High',1
), (
  3, 'North Beardsley', 1
), (
  4, 'San Lauren', 1
);

INSERT INTO events (name, actions)
VALUES (
  'Tardy: 1st Period',
  '{"call-parent", "print-badge"}'
), (
  'Ditched Lunch',
  '{"call-parent"}'
);
