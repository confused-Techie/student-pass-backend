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

INSERT INTO events (event_name)
VALUES (
  'Tardy: 1st Period'
), (
  'Ditched Lunch'
);

INSERT INTO actions (action_name, event_id)
VALUES (
  'call-parent', 1
), (
  'print-badge', 1
), (
  'print-badge', 2
);
