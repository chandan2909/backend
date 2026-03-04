/**
 * Computes strictly ordered tree for a subject and determines locked status.
 * Used by Subjects and Videos logic to verify previous/next and locking.
 */
export function buildSubjectTreeWithLocks(sections: any[], videos: any[], progressMap: Map<number, boolean>) {
  let isFirstOverallVideo = true;
  let lastCompleted = true; 

  const treeSections = sections.map((section) => {
    const secVideos = videos
      .filter((v) => v.section_id === section.id)
      .sort((a, b) => a.order_index - b.order_index);
    
    const mappedVideos = secVideos.map((video) => {
      const isCompleted = progressMap.get(video.id) || false;
      
      // A video is unlocked if:
      // 1. It's the first video of the whole course.
      // 2. The previous video was completed.
      // 3. The video itself is already completed (in case of manual override or if user watched it out of order).
      
      let videoLocked = false;
      if (!isFirstOverallVideo && !lastCompleted && !isCompleted) {
        videoLocked = true;
      }

      const videoData = {
        id: video.id,
        title: video.title,
        order_index: video.order_index,
        is_completed: isCompleted,
        locked: videoLocked
      };

      // update lastCompleted for the NEXT video in the iteration
      lastCompleted = isCompleted;
      isFirstOverallVideo = false;

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
