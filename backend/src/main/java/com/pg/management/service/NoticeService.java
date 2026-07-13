package com.pg.management.service;

import com.pg.management.model.Notice;
import com.pg.management.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public List<Notice> getAllNotices() {
        return noticeRepository.findAllByOrderByPinnedDescCreatedAtDesc();
    }

    @Transactional
    public Notice createNotice(Notice notice) {
        Notice saved = noticeRepository.save(notice);
        log.info("Notice created: {}", notice.getTitle());
        return saved;
    }

    @Transactional
    public void deleteNotice(Long id) {
        if (!noticeRepository.existsById(id)) {
            throw new RuntimeException("Notice not found");
        }
        noticeRepository.deleteById(id);
        log.info("Notice deleted: {}", id);
    }
}
