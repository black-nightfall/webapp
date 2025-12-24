package com.night.admin.product;

import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Repository
public class ProductRepository {
    public Product findById(Long id) {
        if (id == 100L) return new Product(100L, "Laptop", new BigDecimal("1200.00"));
        return null;
    }

    public List<Product> findAll() {
        return Arrays.asList(
            new Product(100L, "Laptop", new BigDecimal("1200.00")),
            new Product(101L, "Mouse", new BigDecimal("25.00"))
        );
    }
}
