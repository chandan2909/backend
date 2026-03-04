/**
 * Computes strictly ordered tree for a subject and determines locked status.
 * Used by Subjects and Videos logic to verify previous/next and locking.
 */
export function buildSubjectTreeWithLocks(sections: any[], videos: any[], progressMap: Map<number, boolean>) {
  let globalLocked = false;
  let lastCompleted = true; // pretend previous before first was completed

  const treeSections = sections.map((section) => {
    const secVideos = videos
      .filter((v) => v.section_id === section.id)
      .sort((a, b) => a.order_index - b.order_index);
    
    const mappedVideos = secVideos.map((video) => {
      const isCompleted = progressMap.get(video.id) || false;
      
      // If the previous video was NOT completed, this one and all subsequent are locked
      if (!lastCompleted) {
        globalLocked = true;
      }

      const videoData = {
        id: video.id,
        title: video.title,
        order_index: video.order_index,
        is_completed: isCompleted,
        locked: globalLocked
      };

      // update lastCompleted for the next iteration
      lastCompleted = isCompleted;

      return videoData;
    });

    return {
      id: section.id,
      title: section.title,
      order_index: section.order_index,
      videos: mappedVideos
    };
  });

  return treeSections;
}
