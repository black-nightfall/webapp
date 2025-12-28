package com.night.website.application

import com.night.website.domain.NewsItem
import com.night.website.infrastructure.persistence.NewsRepository
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class NewsService(private val newsRepository: NewsRepository) {

    suspend fun getAll(): List<NewsItem> = newsRepository.findAll().collectList().awaitSingle()
    
    suspend fun getById(id: String): NewsItem? = newsRepository.findById(id).awaitSingleOrNull()
}
