import { buildSubjectTreeWithLocks } from '../utils/ordering.js';

describe('Ordering and Locking Logic', () => {
  const sections = [
    { id, title: 'Section 1', order_index },
    { id, title: 'Section 2', order_index }
  ];

  const videos = [
    { id, section_id, title: 'Video 1', order_index },
    { id, section_id, title: 'Video 2', order_index },
    { id, section_id, title: 'Video 3', order_index }
  ];

  it('should unlock only the first video if no progress exists', () => {
    const progressMap = new Map<number, boolean>();
    const tree = buildSubjectTreeWithLocks(sections, videos, progressMap);

    const s1 = tree[0];
    expect(s1.videos[0].locked).toBe(false); // Video 1
    expect(s1.videos[1].locked).toBe(true);  // Video 2
    expect(tree[1].videos[0].locked).toBe(true); // Video 3
  });

  it('should unlock the second video if the first is completed', () => {
    const progressMap = new Map<number, boolean>();
    progressMap.set(101, true); // Video 1 completed

    const tree = buildSubjectTreeWithLocks(sections, videos, progressMap);

    const s1 = tree[0];
    expect(s1.videos[0].locked).toBe(false); // Video 1
    expect(s1.videos[0].is_completed).toBe(true);

    expect(s1.videos[1].locked).toBe(false);  // Video 2 unlocked
    expect(s1.videos[1].is_completed).toBe(false);

    expect(tree[1].videos[0].locked).toBe(true); // Video 3 still locked
  });

  it('should unlock a video in next section if last video of previous section is completed', () => {
    const progressMap = new Map<number, boolean>();
    progressMap.set(101, true);
    progressMap.set(102, true);

    const tree = buildSubjectTreeWithLocks(sections, videos, progressMap);

    expect(tree[0].videos[0].locked).toBe(false);
    expect(tree[0].videos[1].locked).toBe(false);
    expect(tree[1].videos[0].locked).toBe(false); // Video 3 unlocked because Video 2 is completed
  });
});
