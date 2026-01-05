package com.night.website.domain.news.repository

import com.night.website.domain.news.entity.NewsItem
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface NewsRepository : ReactiveCrudRepository<NewsItem, Long>
