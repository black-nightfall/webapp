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
}
