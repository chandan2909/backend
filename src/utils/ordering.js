/**
 * Computes strictly ordered tree for a subject and determines locked status.
 * Used by Subjects and Videos logic to verify previous/next and locking.
 */
export function buildSubjectTreeWithLocks(sections, videos, progressMap) {
  let isFirstOverallVideo = true;
  let lastCompleted = true; 

  return sections.map((section) => {
    const secVideos = videos
      .filter((v) => v.section_id === section.id)
      .sort((a, b) => a.order_index - b.order_index);
    
    const mappedVideos = secVideos.map((video) => {
      const isCompleted = progressMap.get(video.id) || false;
      
      let videoLocked = false;
      if (!isFirstOverallVideo && !lastCompleted && !isCompleted) {
        videoLocked = true;
      }

      const videoData = {
        ...video,
        is_completed: isCompleted,
        locked: videoLocked
      };

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
}
