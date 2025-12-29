package com.night.website.domain.news.service

import com.night.website.domain.news.entity.NewsItem
import com.night.website.domain.news.repository.NewsRepository
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.stereotype.Service

@Service
class NewsService(private val newsRepository: NewsRepository) {

    suspend fun getAll(): List<NewsItem> = newsRepository.findAll().collectList().awaitSingle()
    
    suspend fun getById(id: Long): NewsItem? = newsRepository.findById(id).awaitSingleOrNull()

    suspend fun create(newsItem: NewsItem): NewsItem = newsRepository.save(newsItem).awaitSingle()

    suspend fun update(id: Long, newsItem: NewsItem): NewsItem? {
        val existing = newsRepository.findById(id).awaitSingleOrNull() ?: return null
        // Copy existing fields or update. Here we assuming full update but preserving ID and audit fields (handled by DB/App)
        // Usually we map DTO to Entity. Since we use Entity directly, we assume newsItem contains updated data.
        // We force Set ID to ensure it updates the correct record.
        val toSave = newsItem.copy(id = id, createdAt = existing.createdAt) // Keep original CreatedAt
        return newsRepository.save(toSave).awaitSingle()
    }

    suspend fun delete(id: Long) {
        newsRepository.deleteById(id).awaitSingleOrNull()
    }
}
